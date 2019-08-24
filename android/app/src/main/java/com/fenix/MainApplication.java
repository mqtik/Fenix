package com.fenix;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.mehcode.reactnative.splashscreen.SplashScreenPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RCTMGLPackage(),
            new SplashScreenPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new SnackbarPackage(),
            new RCTSplashScreenPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage(),
            new ReactNativeDialogsPackage(),
            new BlurViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
