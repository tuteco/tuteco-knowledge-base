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
    $Data | ConvertTo-Json -Depth 5 | Out-File $fullPath
}

function Convert-BytesToGB {
    param (
        [Parameter(Mandatory = $true)]
        [double]$Bytes
    )

    return [math]::Round($Bytes / (1024 * 1024 * 1024), 2)
}

# Computer
$attributes = @('CsName', 'CsDNSHostName', 'CsDomain', 'CsNetworkAdapters', 
    'CsNumberOfLogicalProcessors', 'CsNumberOfProcessors', 'CsProcessors',
    'CsStatus', 'CsSystemFamily', 'CsSystemSKUNumber', 'CsSystemType', 
    @{Name = 'CsTotalPhysicalMemory GB'; Expression = { Convert-BytesToGB $_.CsTotalPhysicalMemory } },
    'OsName', 'OsVersion', 'OsManufacturer', 'OsNumberOfUsers', 'OsArchitecture', 'OsLocale', 'OsStatus', 
    'HyperVisorPresent',
    'HyperVRequirementDataExecutionPreventionAvailable', 'HyperVRequirementSecondLevelAddressTranslation',
    'HyperVRequirementVirtualizationFirmwareEnabled', 'HyperVRequirementVMMonitorModeExtensions'
)
$data = Get-ComputerInfo | Select-Object $attributes
Out-JsonFile -Category "computer" -Data $data

# Disk
$attributes = @('MediaType', 'BusType', 'Model', @{Name = 'Size GB'; Expression = { Convert-BytesToGB $_.Size } }, 'HealthStatus')
$data = Get-PhysicalDisk | Where-Object { $_.BusType -ne 'USB' } | Select-Object $attributes
Out-JsonFile -Category "disk" -Data $data

# Video Controller
$attributes = @('VideoProcessor', @{Name = 'AdapterRAM GB'; Expression = { Convert-BytesToGB $_.AdapterRAM } }, 'DeviceID', 'Status')
$data = Get-CimInstance -ClassName Win32_VideoController | Select-Object $attributes
Out-JsonFile -Category "video_adapter" -Data $data

# Network Adapter
$attributes = @('Name', 'InstanceID', 'InterfaceAlias', 'InterfaceDescription', 'HardwareInterface',  
    'DeviceID', 'MACAddress', 'LinkSpeed', 'Virtual', 'VlanID', 'Status')
$data = Get-NetAdapter | Select-Object $attributes
Out-JsonFile -Category "network_adapter" -Data $data

# DNS
$attributes = @('InstanceID', 'InterfaceAlias', 'ServerAddresses')
$data = Get-DnsClientServerAddress | Where-Object { $_.ServerAddresses -ne "" } | Select-Object $attributes
Out-JsonFile -Category "dns" -Data $data