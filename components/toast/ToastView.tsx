import { AlertCircleIcon, CancelCircleHalfDotIcon, CancelIcon, CheckmarkBadge01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { useToastContext } from "./ToastContext";
import { ToastItem } from "./types";


const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <HugeiconsIcon icon={CheckmarkBadge01Icon} size="22" color="#2ECC71" />;
    case "error":
      return <HugeiconsIcon icon={CancelCircleHalfDotIcon} size="22" color="#E74C3C" />;
    case "info":
      return <HugeiconsIcon icon={InformationCircleIcon} size="22" color="#3498DB" />;
    case "warning":
      return <HugeiconsIcon icon={AlertCircleIcon} size="22" color="#F39C12" />;
    default:
      return null;
  }
};

const AnimatedToastItem = ({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        easing: Easing.in(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose(toast.id);
    });
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      {getIcon(toast.type)}
      <Text numberOfLines={3} style={styles.text}>{toast.message}</Text>
      <HugeiconsIcon
        onPress={handleClose}
        icon={CancelIcon} size="22" color="#111" />
    </Animated.View>
  );
};

const ToastView = ({ toasts }: { toasts: ToastItem[] }) => {
  const { close } = useToastContext();

  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <AnimatedToastItem key={toast.id} toast={toast} onClose={close} />
      ))}
    </View>
  );
};

export default ToastView;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
    zIndex: 9999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    width: "90%",
    // shadowColor: "#000",
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: "#111",
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
});