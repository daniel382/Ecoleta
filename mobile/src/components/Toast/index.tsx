import React, { useRef } from 'react';
import { Animated, Text } from 'react-native';

import styles from './styles';

interface Props {
  show: boolean;
  message: string;
  onAnimationEnd: () => void;
}

function Toast(props: Props) {
  const { show, message, onAnimationEnd } = props;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  function fade(value: number, duration: number) {
    Animated.timing(
      fadeAnimation,
      {
        toValue: value,
        duration
      }
    ).start();
  }

  function animatedToast() {
    if (!show)
      return;

    fade(.9, 500);

    setTimeout(function () {
      fade(0, 1500);
      onAnimationEnd()
    }, 1500);
  }

  if (show) {
    animatedToast();
    console.log(show)
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <Text style={styles.text}>
        {message}
      </Text>
    </Animated.View>
  );
}

export default Toast;
