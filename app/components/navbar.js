import React from "react";
import { Header } from "react-navigation";
import { View, Platform, Dimensions, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { BlurView, VibrancyView } from "../../libraries/blur";
import { BottomTabBar } from 'react-navigation-tabs';
let ancho = Dimensions.get('window').width; //full width
let alto = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomTabBar: {
    backgroundColor: 'transparent',
  },
});

const NavbarBottom = props => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right:0
      }}
    >
    <BlurView tint="light" blurAmount={10} style={styles.blurView}>
      <BottomTabBar {...props} style={styles.bottomTabBar} />
    </BlurView>
    </View>
  );
};

export default NavbarBottom;