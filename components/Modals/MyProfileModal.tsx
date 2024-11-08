import {
    View,
    Text,
    Modal as RNModal,
    ModalProps,
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
  import { BlurView } from 'expo-blur';
  
  type PROPS = ModalProps & {
    isOpen: boolean;
    withInput?: boolean;
    onClose: () => void;
  };
  
  const MyProfileModal = ({ isOpen, withInput, onClose, children, ...rest }: PROPS) => {
    const content = withInput ? (
      <KeyboardAvoidingView
        style={styles.modalContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {children}
      </KeyboardAvoidingView>
    ) : (
      <View style={styles.modalContent}>{children}</View>
    );
  
    return (
      <RNModal
        visible={isOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        {...rest}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={20} style={styles.backdrop} experimentalBlurMethod="dimezisBlurView" tint="dark">
          <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} activeOpacity={1} />
        </BlurView>
          {content}
        </View>
      </RNModal>
    );
  };
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-end",
      backgroundColor: "rgba(24, 24, 27, 0.9)",
      paddingHorizontal: 15,
      paddingTop: 75
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
      },
      backdropTouchable: {
        ...StyleSheet.absoluteFillObject,
      },
    modalContent: {
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      backgroundColor: "white",
      borderRadius: 16,
      width: "60%",
    },
  });
  
  export default MyProfileModal;
  