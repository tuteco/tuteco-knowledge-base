param(
    [Parameter(Mandatory = $true)]
    [string]$CustomerId
)

function Get-DeviceIdentifier {
    param (
        [Parameter(Mandatory = $true)]
        [string]$BasePath,
        
        [Parameter(Mandatory = $false)]
        [string]$DeviceId = ""
    )

    # check empty device identifier
    while ([string]::IsNullOrWhiteSpace($deviceId)) {
        # set the value manuell
        $deviceId = Read-Host "Gib den neuen Device Identifier ein: "
    }
    Write-Host "Device Identifier: $deviceId"

    $path = Join-Path -Path $BasePath -ChildPath $deviceId

    if (Test-Path -Path $path) {
        # path already exists
        $response = Read-Host "Device $deviceId existiert bereits. Ueberschreiben? (Y/N)"
        if ($response -eq "Y") {
            # cleanup
            Remove-Item -Path $path -Recurse -Force
            return $deviceId
        } else {
            # get new device identifier
            return Get-DeviceIdentifier -BasePath $BasePath
        }
    } else {
        # new device identifier
        return $deviceId
    }

}


# build output path
$root = (Get-Item $PSScriptRoot).PSDrive.Root
$outputPath = Join-Path -Path $root -ChildPath "output"

# build output path for customer
$outputPath = Join-Path -Path $outputPath -ChildPath $CustomerId

# get device identifier
$deviceId = Get-ComputerInfo | Select-Object CsName, CsDNSHostName

# check device identifier, it must be unique
if ([string]::IsNullOrWhiteSpace($deviceId.CsDNSHostName)) {
    $deviceId = Get-DeviceIdentifier -DeviceId $deviceId.CsName -BasePath $outputPath
} else {
    $deviceId = Get-DeviceIdentifier -DeviceId $deviceId.CsDNSHostName -BasePath $outputPath
}

# device path already checked, it can be created
$outputPath = Join-Path -Path $outputPath -ChildPath $deviceId

$outputPathHardware = Join-Path -Path $outputPath -ChildPath "hardware"
$outputPathSoftware = Join-Path -Path $outputPath -ChildPath "software"

# create output folders
New-Item -Path $outputPathHardware -ItemType Directory -Force
New-Item -Path $outputPathSoftware -ItemType Directory -Force


# execute scripts to collect device information
$scriptPath = Join-Path -Path $PSScriptRoot -ChildPath "device_info.ps1"
& $scriptPath -OutputBasePath $outputPathHardware

$scriptPath = Join-Path -Path $PSScriptRoot -ChildPath "software_info.ps1"
& $scriptPath -OutputBasePath $outputPathSoftware
