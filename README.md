# Install
npm install

# Link to native code
1. react-native link react-native-gesture-handler
2. react-native link rn-splash-screen
3. react-native link react-native-linear-gradient
4. react-native link react-native-static-server && react-native link react-native-webview && react-native link react-native-zip-archive && RNFB_ANDROID_PERMISSIONS=true react-native link rn-fetch-blob && react-native link react-native-orientation
5. react-native link react-native-dialogs
6. react-native link react-native-vector-icons
7. RNFB_ANDROID_PERMISSIONS=true react-native link react-native-fetch-blob
8. react-native link react-native-maps-navigation

# Clean Install
lsof -ti :8081 | xargs kill -9
npm start -- --reset-cache


# Run
react-native run-ios

react-native run-android

# Release on Android

./gradlew assembleRelease

On node_modules/react-native/react.grandle
Place this code where doFirst{} method is
		`
		doLast {
            def moveFunc = { resSuffix ->
                File originalDir = file("$buildDir/generated/res/react/release/drawable-${resSuffix}");
                if (originalDir.exists()) {
                    File destDir = file("$buildDir/../src/main/res/drawable-${resSuffix}");
                    ant.move(file: originalDir, tofile: destDir);
                }
            }
            moveFunc.curry("ldpi").call()
            moveFunc.curry("mdpi").call()
            moveFunc.curry("hdpi").call()
            moveFunc.curry("xhdpi").call()
            moveFunc.curry("xxhdpi").call()
            moveFunc.curry("xxxhdpi").call()
        }
        `



## Errors

	- No bundle URL present.
		Run: 
			 rm -rf ios/build/; lsof -ti :8081 | xargs kill -9; react-native run-ios --simulator="iPhone 6"

	- React Native Settings
		Go to react-native-settings under node_modules folder, and change its .JSX extensions to .JS

    - Duplicate resources:
    Place the doLast code.

    - If error with linking BVLinearGradient on Pods, put this before pod 'BVLinearGradient'
    pod "yoga", :path => "../node_modules/react-native/ReactCommon/yoga"
pod 'React', :path => '../node_modules/react-native', :subspecs => [
  'Core',
  'DevSupport',
  'RCTNetwork',
  'RCTWebSocket'
]
 then:
 cd ios && rm -rf Pods/ && pod install


# Splashscreen & icon
I recommend [generator-rn-toolbox](https://github.com/bamlab/generator-rn-toolbox) for applying launch screen or main icon using on react-native. It is more simple and easy to use through cli as react-native.

 - Do not need to open XCode.
 - Do not need to make a lot of image files for various resolutions.
 - Anytime change launch screen using one line commend. 


## Requirements

 - node >= 6
 - One **square** image or psd file with a size of more than **2208x2208** px resolution for a launch screen(splash screen)
 - Positive mind ;)

## Install
 1. Install generator-rn-toolbox and yo
 2. `npm install -g yo `
 3. Install imagemagick
`brew install imagemagick`
 4. Apply splash screen on iOS

 ```yo rn-toolbox:assets --splash YOURIMAGE.png --ios```

 or Android

 ```yo rn-toolbox:assets --splash YOURIMAGE.png --android```


That's all. :) 


## Run on iOS
- react-native run-ios --configuration Release --device "Matías’s iPhone"

Go to XCode -> Products -> Scheme -> Edit Scheme 
On Build Configuration, change Debug to Release

ART Shape not found (React-native-progress):
Add the ART.xcodeproj (found in node_modules/react-native/Libraries/ART) to the Libraries group and add libART.a to Link Binary With Libraries under Build Phases.
## Android

1. DEX Error on Compile 
	Go to *android/build.gradle*
	
	On *defaultConfig* {} (where is the targetSdk, compileSdk, etc.),
	 place this line:
	 `multiDexEnabled = true`

2. Deploy to phone
	adb install -r ./android/app/build/outputs/apk/release/app-release.apk

[Source][1]


  [1]: https://github.com/bamlab/generator-rn-toolbox/blob/master/generators/assets/README.md


## Google Maps

The pod, must be like this: 
```
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'Fenix' do
  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # Pods for Fenix
     pod "yoga", :path => "../node_modules/react-native/ReactCommon/yoga"
    pod 'React', :path => '../node_modules/react-native', :subspecs => [
      'Core',
      'DevSupport',
      'RCTNetwork',
      'RCTImage',
      'RCTWebSocket',
      'RCTGeolocation',
      'RCTLinkingIOS',
      'RCTNetwork',
      'RCTSettings',
      'RCTText',
      'RCTVibration',
      'RCTActionSheet'
    ]
    pod 'react-native-blur', :path => '../node_modules/@react-native-community/blur'

    pod 'RNGestureHandler', :path => '../node_modules/react-native-gesture-handler'

    pod 'BVLinearGradient', :path => '../node_modules/react-native-linear-gradient'

    pod 'react-native-maps', :path => '../node_modules/react-native-maps'

    pod 'react-native-google-maps', :path => '../node_modules/react-native-maps'  # Uncomment this line if you want to support GoogleMaps on iOS
    pod 'GoogleMaps'  # Uncomment this line if you want to support GoogleMaps on iOS
    pod 'Google-Maps-iOS-Utils' # Uncomment this line if you want to support GoogleMaps on iOS
    pod 'RNSnackbar', :path => '../node_modules/react-native-snackbar'

    pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'

    pod 'react-native-wkwebview', :path => '../node_modules/react-native-wkwebview-reborn'

    pod 'rn-fetch-blob', :path => '../node_modules/rn-fetch-blob'


  target 'FenixTests' do
    inherit! :search_paths
    # Pods for testing
  end

end

target 'Fenix-tvOS' do
  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # Pods for Fenix-tvOS

  target 'Fenix-tvOSTests' do
    inherit! :search_paths
    # Pods for testing
  end

end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name == 'react-native-google-maps'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_ENABLE_MODULES'] = 'No'
      end
    end
    if target.name == "React"
      target.remove_from_project
    end
  end
end
```

And in the AppDelegator, let's define API Key
```
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <GoogleMaps/GoogleMaps.h> # <-- there!!!!! #####

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  #ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif


    [GMSServices provideAPIKey:@"YOUR GOOGLE MAPS API KEY"];
    ^ and here!


  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Fenix"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
```

# Updated iOS?
Go to:
`/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport`
and copy one of the folders, example 12.0.1, and rename like: 12.2.1 ({id}) and paste it again.
The {id} is whatever is under () in other folder examples.