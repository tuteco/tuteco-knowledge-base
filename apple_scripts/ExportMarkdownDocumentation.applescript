-- Export Markdown

global gExportFolder

tell application id "DNtp"
	try
		set theSelection to selection
		if theSelection is {} then
			display alert "No Selection" message "Please select a group in DEVONthink." as warning
			return
		end if
		
		set gExportFolder to choose folder with prompt "Choose where to export the group to:"
		
		set allUUIDs to {}
		repeat with theGroup in theSelection
			if (type of theGroup) is group then
				set allUUIDs to my getAllUUIDs(theGroup, allUUIDs)
			else
				display alert "Invalid Selection" message "Please select a group, not a single document." as warning
				return
			end if
		end repeat
		
		repeat with theGroup in theSelection
			my exportGroupRecursively(theGroup, allUUIDs)
		end repeat
	on error errorMessage number errorNumber
		display alert "Error" message errorMessage as warning
	end try
	beep 3
end tell

on getAllUUIDs(theGroup, allUUIDs)
	try
		tell application id "DNtp"
			set theRecords to children of theGroup
			repeat with theRecord in theRecords
				set recordType to type of theRecord
				if recordType is group then
					set allUUIDs to my getAllUUIDs(theRecord, allUUIDs)
				else if recordType is markdown then
					-- save UUID
					set end of allUUIDs to uuid of theRecord
				end if
			end repeat
		end tell
	on error errMsg number errorNumber
		display dialog "An unknown error occurred:  " & errorNumber as text
	end try
	
	return allUUIDs
end getAllUUIDs

on exportGroupRecursively(theGroup, allUUIDs)
	try
		tell application id "DNtp"
			set groupName to (location of theGroup & name of theGroup)
			
			set exportPath to (POSIX path of gExportFolder) & groupName
			
			-- Create a folder in the export location
			do shell script "mkdir -p " & quoted form of exportPath
			
			set theRecords to children of theGroup
			repeat with theRecord in theRecords
				set recordType to type of theRecord
				if recordType is group then
					-- Recursively export child groups
					my exportGroupRecursively(theRecord, allUUIDs)
				else if recordType is markdown then
					-- BEGIN OF build markdown metadata
					set theCategory to name of theGroup
					set theCategory to "category: " & (texts 1 thru 4 of theCategory)
					set theUUID to "uuid: " & (uuid of theRecord)
					set theDatabaseName to "data-source-name: " & (name of database of theRecord)
					set combinedMeta to ("---" & return & theCategory & return & theUUID & return & theDatabaseName & return & "data-source-type: DEVONthink" & return)
					set theLabel to label of theRecord
					if (theLabel ≠ 0) then
						set combinedMeta to (combinedMeta & "label: " & theLabel & return)
					end if
					set theTags to tags of theRecord
					-- build tags list
					set i to 1
					repeat with theTag in theTags
						if (i = 1) then
							set combinedMeta to (combinedMeta & "tags: " & theTag & return)
						else
							set combinedMeta to (combinedMeta & my getIntent(5) & theTag & return)
						end if
						set i to i + 1
					end repeat
					-- build incoming links
					set incomingRefs to incoming reference of theRecord
					set combinedMeta to my buildMetaLinks(incomingRefs, "ilinks", allUUIDs, combinedMeta)
					-- build outgoing links
					set outgoingRefs to outgoing reference of theRecord
					set combinedMeta to my buildMetaLinks(outgoingRefs, "olinks", allUUIDs, combinedMeta)
					-- close metadata
					set combinedMeta to (combinedMeta & "---" & return)
					-- END OF build markdown metadata
					
					-- get content and set metadata at the beginning
					set ptcontent to combinedMeta & return & (plain text of theRecord)
					-- modify links
					
					-- set _database to current database
					-- set _term to reference URL of theRecord
					-- set _searchTerm to "content: " & "\"" & _term & "\"" & " kind:markdown"
					-- set _results to (search _searchTerm) in _database
					
					set modifiedContent to my replaceDevonthinkLinks(ptcontent)
					set recordName to (name of theRecord) & ".md"
					
					-- Write the modified content to file
					set filePath to (exportPath & "/" & recordName)
					do shell script "echo " & quoted form of modifiedContent & " > " & quoted form of filePath
				else
					-- Export other file types as they are
					-- export theRecord to exportPath
				end if
			end repeat
		end tell
	on error errMsg number errorNumber
		
		display dialog "An unknown error occurred:  " & errorNumber as text
		
	end try
end exportGroupRecursively

on replaceDevonthinkLinks(ptcontent)
	tell application id "DNtp"
		set modifiedContent to ptcontent
		set listOfUUID to do shell script "echo " & quoted form of ptcontent & "| perl -nle 'print $1 while /x-devonthink-item:\\/\\/([0-9A-Fa-f-]+)/g'"
		
		-- Iterate over each link, replacing with the actual relative path
		set linkList to paragraphs of listOfUUID
		repeat with theLink in linkList
			set recordUUID to theLink
			set linkedRecord to get record with uuid recordUUID
			
			if linkedRecord is not missing value then
				set relativePath to (location of linkedRecord & name of linkedRecord) & ".md"
				set modifiedContent to my replaceText("x-devonthink-item://" & recordUUID, relativePath, modifiedContent)
			else
				set modifiedContent to my replaceText("x-devonthink-item://" & recordUUID, "[missing link]", modifiedContent)
			end if
		end repeat
	end tell
	
	return modifiedContent
end replaceDevonthinkLinks

on replaceText(findText, replaceText, theContent)
	try
		-- save old delimiters
		set oldDelimiters to AppleScript's text item delimiters
		
		-- split text by delimiters
		-- every occurrence of delimiters is deleted from the string
		set AppleScript's text item delimiters to {replaceText, findText}
		
		-- join splitted text
		-- the first delimiter only is inserted in between each chunk of text
		set theContent to text items of theContent as text
		
		-- restore old delimiters
		set AppleScript's text item delimiters to oldDelimiters
		
		return theContent
	on error
		-- restore old delimiters
		set AppleScript's text item delimiters to oldDelimiters
	end try
end replaceText

on getIntent(n)
	-- build an Intent
	set anIntent to space
	repeat with i from 1 to n
		set anIntent to (anIntent & space)
	end repeat
	return anIntent
end getIntent

on buildMetaLinks(links, tagName, allUUIDs, combinedMeta)
	tell application id "DNtp"
		set i to 1
		repeat with link in links
			if (uuid of link) is in allUUIDs then
				set locationGroupName to (name of location group of link)
				set refURL to (texts 1 thru 4 of locationGroupName) & "|" & (document name of link) & "|" & (uuid of link)
				if (tagName = "olinks") then
					set refURL to refURL & "|" & (name of link)
				end if
				if (i = 1) then
					set combinedMeta to (combinedMeta & tagName & ": " & refURL & return)
				else
					set combinedMeta to (combinedMeta & my getIntent(7) & refURL & return)
				end if
				set i to i + 1
			end if
		end repeat
	end tell
	
	return combinedMeta
end buildMetaLinks
