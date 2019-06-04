import React from "react";
import { Header } from "react-navigation";
import { View, Platform, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { BlurView, VibrancyView } from "../../libraries/blur";
let ancho = Dimensions.get('window').width; //full width
let alto = Dimensions.get('window').height; //full height

const HeaderFX = props => {
  return (
    <View
      style={{
        height: 56,
      }}
    >
    <BlurView
          style={{height: 'auto', width: '100%', top:0, position: 'absolute'}}
          //blurType="light"
          blurAmount={4}
        >
        <Header {...props} />
        </BlurView>
       
    </View>
  );
};

export default HeaderFX;