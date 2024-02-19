import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { colors, sizes } from "../../constants";
export default function Input({
  autoCorrect,
  autoComplete,
  autoCapitalize,
  onSubmitEditing,
  placeholder,
  onChangeText,
  value,
  defaultValue,
  secure,
  keyboardType,
  multiline,
  maxLength,
  scrollEnabled,
  error,
  errorMessage,
  editable,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <View style={error ? styles.errorContainer : styles.container(focused)}>
        <TextInput
          style={styles.input}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secure}
          defaultValue={defaultValue}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          scrollEnabled={scrollEnabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
        />
      </View>
      {error && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: (focused) => ({
    padding: 16,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 8,
    borderColor: focused ? colors.gray : colors.light_gray,
  }),
  input: {
    fontSize: sizes.body1,
  },
  errorContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 8,
    borderColor: colors.error,
  },
  error: {
    color: colors.error,
    fontSize: sizes.body2,
    paddingLeft: 20,
    marginBottom: 10,
  },
});
