//Include this into your config.js file
{
    module: "MMM-Shelly-PM",
    header: "Shelly-PM",
    position: "top_left",
    config: {
        //Your Shelly PM needs to have a fixed IP (or your LAN must be supporting mDNS)
        ShellyApiPath: "http://192.168.0.149/rpc/Shelly.GetStatus",
        RefreshIntervalLAN: "5000", //milliseconds
		negativeDisplay: true,

		cloudServerPath: "https://shelly-XX-eu.shelly.cloud/statistics/relay/consumption",
		deviceId: "3c6XXXXXX",
		authKey: "XXXXX",
		RefreshIntervalCloud: "60000", //milliseconds, here 1 minute

		broadcastToEnergyMonitor: true,
    }
}
