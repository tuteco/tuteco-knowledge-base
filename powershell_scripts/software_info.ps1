function Out-MarkdownList {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Category,
        [object]$Data
    )

    return $Data | ForEach-Object { "`n- __" + $Category + "__`n" + 
    ($_.PSObject.Properties | ForEach-Object { "`n- __" + $Category + " " + $_.Name + ":__ " + $_.Value }) }
}

$PublisherExcludeList = @('Microsoft Corporation', 'NVIDIA Corporation', 'Intel Corporation')

# Registry
$UninstallPath = 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*'
$items = Get-ItemProperty $UninstallPath | 
Where-Object { -not [string]::IsNullOrWhiteSpace($_.DisplayName) -and $_.Publisher -notin $PublisherExcludeList }

$UninstallPath = 'HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
$items += Get-ItemProperty $UninstallPath | 
Where-Object { -not [string]::IsNullOrWhiteSpace($_.DisplayName) -and $_.Publisher -notin $PublisherExcludeList }
$count_registry = $items.count

$attributes = @('DisplayName', 'DisplayVersion', 'Publisher', 'InstallDate', 'Inno Setup: User')
$data = $items | Select-Object $attributes

$registry = Out-MarkdownList -Category "Registry" -Data $data

# MSI
$attributes = @('Caption', 'Version', 'Vendor', 'InstallDate')
$data = Get-CimInstance -ClassName Win32_Product | 
Where-Object { -not [string]::IsNullOrWhiteSpace($_.Caption) -and $_.Vendor -notin $PublisherExcludeList } | 
Select-Object $attributes
$count_msi = $data.count
$msi = Out-MarkdownList -Category "MSI" -Data $data

# Microsoft Store
$attributes = @('Name', 'Version', @{Name = 'Publisher'; Expression = {[regex]::Match($_.Publisher, "CN=([^,]+)").Groups[1].Value}})
$data = Get-AppxPackage | 
Where-Object {
    $_.NonRemovable -ne $true -and 
    $_.SignatureKind -ne 'System' -and 
    [regex]::Match($_.Publisher, "O=([^,]+)").Groups[1].Value -notin $PublisherExcludeList
} | Select-Object $attributes
$count_store = $data.count
$store = Out-MarkdownList -Category "Microsoft Store" -Data $data


$markdownContent = @"
# $env:COMPUTERNAME
- __Registry Count:__ $count_registry
$registry

- __MSI Count:__ $count_msi
$msi

- __Microsoft Store Count:__ $count_store
$store
"@

$markdownContent | Out-File .\data\software_info.md -Encoding utf8