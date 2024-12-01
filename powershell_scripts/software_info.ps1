param(
    [Parameter(Mandatory = $true)]
    [string]$OutputBasePath
)


function Out-JsonFile {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Category,
        [object]$Data
    )

    $filename = $Category + '.json'
    $fullPath = Join-Path -Path $OutputBasePath -ChildPath $filename

    Write-Host "Schreibe Datei: $fullPath"

    $Data | ConvertTo-Json -Depth 5 | Out-File $fullPath
}

$PublisherExcludeList = @('Microsoft Corporation', 'NVIDIA Corporation', 'Intel Corporation')

# Registry
Write-Host "Lade Software Informationen aus Registry ..."
$UninstallPath = 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*'
$items = Get-ItemProperty $UninstallPath | 
Where-Object { -not [string]::IsNullOrWhiteSpace($_.DisplayName) -and $_.Publisher -notin $PublisherExcludeList }

$UninstallPath = 'HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
$items += Get-ItemProperty $UninstallPath | 
Where-Object { -not [string]::IsNullOrWhiteSpace($_.DisplayName) -and $_.Publisher -notin $PublisherExcludeList }

$attributes = @('DisplayName', 'DisplayVersion', 'Publisher', 'InstallDate', 'Inno Setup: User')
$data = $items | Select-Object $attributes

Out-JsonFile -Category "registry" -Data $data

# MSI
Write-Host "Lade Informationen zur Software mit .msi Installer ..."
$attributes = @('Caption', 'Version', 'Vendor', 'InstallDate')
$data = Get-CimInstance -ClassName Win32_Product | 
Where-Object { -not [string]::IsNullOrWhiteSpace($_.Caption) -and $_.Vendor -notin $PublisherExcludeList } | 
Select-Object $attributes

Out-JsonFile -Category "msi" -Data $data

# Microsoft Store
Write-Host "Lade Software Informationen aus Microsoft Store ..."
$attributes = @('Name', 'Version')
$data = Get-AppxPackage -AllUsers | 
Where-Object {
    $_.NonRemovable -ne $true -and 
    $_.SignatureKind -ne 'System' -and 
    [regex]::Match($_.Publisher, "O=([^,]+)").Groups[1].Value -notin $PublisherExcludeList
} | Select-Object $attributes

Out-JsonFile -Category "ms_store" -Data $data