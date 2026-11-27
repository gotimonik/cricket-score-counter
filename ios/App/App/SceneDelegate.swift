import UIKit
import Capacitor

/// UIScene lifecycle for the app's single window.
///
/// Apps built with the iOS 27 SDK (Xcode 27) must adopt scenes or they fail
/// to launch. Capacitor 7 has no SceneDelegate of its own (that arrived in
/// Capacitor 8.5), so this one does the two jobs the AppDelegate used to:
///
/// 1. The window. UIKit builds it from Main.storyboard (CAPBridgeViewController)
///    via UISceneStoryboardFile in Info.plist. We also hand it to
///    AppDelegate.window, because some plugins (AdMob, SplashScreen) look
///    there before falling back to the connected scene.
///
/// 2. Incoming URLs and universal links. With a scene manifest, iOS no longer
///    calls the AppDelegate open-URL / continue-activity methods; it calls
///    the scene ones below. We forward them to ApplicationDelegateProxy,
///    which posts the notifications the App plugin (appUrlOpen,
///    getLaunchUrl) and Google sign-in listen for.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard scene is UIWindowScene else { return }

        if let appDelegate = UIApplication.shared.delegate as? AppDelegate {
            appDelegate.window = window
        }

        // Cold launch from a link: the URL or activity arrives here instead
        // of in scene(_:openURLContexts:). Forwarding it now sets
        // ApplicationDelegateProxy.lastURL, which App.getLaunchUrl() reads.
        if let urlContext = connectionOptions.urlContexts.first {
            openURL(urlContext)
        }
        if let userActivity = connectionOptions.userActivities.first(where: { $0.activityType == NSUserActivityTypeBrowsingWeb }) {
            _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
        }
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        for context in URLContexts {
            openURL(context)
        }
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
    }

    private func openURL(_ context: UIOpenURLContext) {
        var options: [UIApplication.OpenURLOptionsKey: Any] = [
            .openInPlace: context.options.openInPlace
        ]
        if let sourceApplication = context.options.sourceApplication {
            options[.sourceApplication] = sourceApplication
        }
        if let annotation = context.options.annotation {
            options[.annotation] = annotation
        }
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: context.url, options: options)
    }
}
