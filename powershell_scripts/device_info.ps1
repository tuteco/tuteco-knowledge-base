function Out-MarkdownList {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Category,
        [object]$Data
    )

    return $Data | ForEach-Object { "`n- __" + $Category + "__`n" + 
    ($_.PSObject.Properties | ForEach-Object { "`n- __" + $Category + " " + $_.Name + ":__ " + $_.Value }) }
}

function Convert-BytesToGB {
    param (
        [Parameter(Mandatory = $true)]
        [double]$Bytes
    )

    return [math]::Round($Bytes / (1024 * 1024 * 1024), 2)
}

# OS
$attributes = @('Caption', 'OSArchitecture', 'NumberOfUsers')
$data = Get-CimInstance -ClassName Win32_OperatingSystem | Select-Object $attributes
$os = Out-MarkdownList -Category "OS" -Data $data

# Processor
$attributes = @('Role', 'Name', 'NumberOfEnabledCore', 'NumberOfLogicalProcessors', 'ThreadCount', 'VMMonitorModeExtensions', 'VirtualizationFirmwareEnabled', 'ProcessorId')
$data = Get-CimInstance -ClassName Win32_Processor | Select-Object $attributes
$processor = Out-MarkdownList -Category "Prozessor" -Data $data

# Memory
$attributes = @(@{Name = 'TotalPhysicalMemory GB'; Expression = {Convert-BytesToGB $_.TotalPhysicalMemory}})
$data = Get-CimInstance -ClassName Win32_ComputerSystem | Select-Object $attributes
$custom = [PSCustomObject]@{
    Count = (Get-CimInstance -ClassName Win32_PhysicalMemory).count
    "TotalPhysicalMemory GB" = $data."TotalPhysicalMemory GB"
}
$memory = Out-MarkdownList -Category "Memory" -Data $custom

# Disk
# $attributes = @('Model', 'Size', @{Name = 'Size GB'; Expression = {Convert-BytesToGB $_.Size}}, 'PNPDeviceID', 'Caption', 'Status')
# $data = Get-CimInstance -ClassName Win32_DiskDrive | Select-Object $attributes
# $disk = Out-MarkdownList -Category "Festplatte" -Data $data

$attributes = @('MediaType', 'BusType', 'Model', @{Name = 'Size GB'; Expression = {Convert-BytesToGB $_.Size}}, 'HealthStatus')
$data = Get-PhysicalDisk | Select-Object $attributes
$disk = Out-MarkdownList -Category "Festplatte" -Data $data

# Video Controller
$attributes = @('Caption', 'PNPDeviceID', 'VideoProcessor', @{Name = 'AdapterRAM GB'; Expression = {Convert-BytesToGB $_.AdapterRAM}})
$data = Get-CimInstance -ClassName Win32_VideoController | Select-Object $attributes
$video = Out-MarkdownList -Category "Grafikkarte" -Data $data

# Network Adapter
$attributes = @('Name', 'InterfaceDescription', 'MACAddress', 'Status', 'LinkSpeed', 'InstanceID', 'HardwareInterface', 'Virtual', 'VlanID')
$data = Get-NetAdapter | Select-Object $attributes
$net_adapter = Out-MarkdownList -Category "Network Adapter" -Data $data

# IP
$attributes = @('InterfaceAlias', 'NetAdapter', 'IPv4Address', 'IPv6Address', 'IPv6LinkLocalAddress', 'DHCPEnabled')
$data = Get-NetIPConfiguration | Select-Object $attributes
$ip = Out-MarkdownList -Category "IP" -Data $data

# DNS
$attributes = @('InterfaceAlias', 'ServerAddresses')
$data = Get-DnsClientServerAddress | Where-Object {$_.ServerAddresses -ne ""} | Select-Object $attributes
$dns = Out-MarkdownList -Category "DNS" -Data $data


$markdownContent = @"
# $env:COMPUTERNAME
$os
$processor
$memory
$disk
$video
$net_adapter
$ip
$dns
"@

$markdownContent | Out-File .\data\device_info.md -Encoding utf8