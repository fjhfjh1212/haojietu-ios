import Foundation
import Capacitor

/// Switches the app icon between the original's three choices
/// （微截图2 / 微信 / 支付宝）, using iOS alternate icons.
///
/// The three icons are bundled as alternate icon image sets
/// (AppIcon-wechat / AppIcon-alipay) by scripts/patch_alternate_icons.py
/// at build time; the primary icon (微截图2) is the default AppIcon.
/// iOS shows a system alert on every change — that is a platform
/// behaviour, not an app bug. Only the pre-bundled icons can be used.
@objc(AlternateIconPlugin)
public class AlternateIconPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AlternateIconPlugin"
    public let jsName = "AlternateIcon"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setAlternateIcon", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAlternateIconName", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "supportsAlternateIcons", returnType: CAPPluginReturnPromise)
    ]

    /// name: "wechat" | "alipay" | null/"" for the primary icon （微截图2）.
    @objc func setAlternateIcon(_ call: CAPPluginCall) {
        guard UIApplication.shared.supportsAlternateIcons else {
            call.reject("Alternate icons are not supported on this device")
            return
        }
        let raw = call.getString("name")
        let iconName: String? = (raw == nil || raw == "") ? nil : raw
        UIApplication.shared.setAlternateIconName(iconName) { error in
            if let error = error {
                call.reject("Failed to change icon: \(error.localizedDescription)")
            } else {
                call.resolve()
            }
        }
    }

    @objc func getAlternateIconName(_ call: CAPPluginCall) {
        call.resolve(["name": UIApplication.shared.alternateIconName as Any])
    }

    @objc func supportsAlternateIcons(_ call: CAPPluginCall) {
        call.resolve(["supported": UIApplication.shared.supportsAlternateIcons])
    }
}
