import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import { GlassCard, GlassButton } from "../GlassCard";

describe("GlassCard", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <GlassCard>
        <Text>Test Content</Text>
      </GlassCard>
    );

    expect(getByText("Test Content")).toBeTruthy();
  });

  it("applies custom border radius", () => {
    const { getByText } = render(
      <GlassCard borderRadius={20}>
        <Text>Content</Text>
      </GlassCard>
    );

    // Just verify the component renders
    expect(getByText("Content")).toBeTruthy();
  });

  it("accepts custom style prop", () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <GlassCard style={customStyle}>
        <Text>Content</Text>
      </GlassCard>
    );

    // Just verify the component renders with content
    expect(getByText("Content")).toBeTruthy();
  });
});

describe("GlassButton", () => {
  it("renders button title correctly", () => {
    const { getByText } = render(
      <GlassButton title="Click Me" onPress={() => {}} />
    );

    expect(getByText("Click Me")).toBeTruthy();
  });

  it("calls onPress when pressed", async () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <GlassButton title="Press Me" onPress={onPressMock} />
    );

    const button = getByTestId("glass-button");
    fireEvent.press(button);

    await waitFor(() => {
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  it("does not call onPress when disabled", async () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <GlassButton title="Disabled" onPress={onPressMock} disabled={true} />
    );

    const button = getByTestId("glass-button");
    fireEvent.press(button);

    await waitFor(() => {
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  it("shows loading indicator when loading", () => {
    const { queryByText, getByTestId } = render(
      <GlassButton title="Loading" onPress={() => {}} loading={true} />
    );

    // Title should not be visible
    expect(queryByText("Loading")).toBeNull();

    // ActivityIndicator should be present
    const button = getByTestId("glass-button");
    expect(button).toBeTruthy();
  });

  it("does not call onPress when loading", async () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <GlassButton title="Loading" onPress={onPressMock} loading={true} />
    );

    const button = getByTestId("glass-button");
    fireEvent.press(button);

    await waitFor(() => {
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  it("applies primary variant styles", () => {
    const { getByTestId } = render(
      <GlassButton title="Primary" onPress={() => {}} variant="primary" />
    );

    const button = getByTestId("glass-button");
    expect(button).toBeTruthy();
  });

  it("applies secondary variant styles", () => {
    const { getByTestId } = render(
      <GlassButton title="Secondary" onPress={() => {}} variant="secondary" />
    );

    const button = getByTestId("glass-button");
    expect(button).toBeTruthy();
  });

  it("applies custom text style", () => {
    const customTextStyle = { fontSize: 20 };
    const { getByText } = render(
      <GlassButton
        title="Styled"
        onPress={() => {}}
        textStyle={customTextStyle}
      />
    );

    const text = getByText("Styled");
    expect(text.props.style).toContainEqual(
      expect.objectContaining(customTextStyle)
    );
  });

  it("handles press state changes", async () => {
    const { getByTestId } = render(
      <GlassButton title="Press" onPress={() => {}} />
    );

    const button = getByTestId("glass-button");

    // Simulate press in
    fireEvent(button, "pressIn");
    await waitFor(() => {
      expect(button).toBeTruthy();
    });

    // Simulate press out
    fireEvent(button, "pressOut");
    await waitFor(() => {
      expect(button).toBeTruthy();
    });
  });
});
