import { placeholderImage } from "@/assets/images/image.index";
import React, { useState } from "react";
import {
  Image,
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from "react-native";

type Props = {
  url?: string;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageProps["resizeMode"];
} & Omit<ImageProps, "source">;

const DEFAULT_IMAGE: ImageSourcePropType =
  placeholderImage.housePlaceholder;

export default function FallbackImage({
  url,
  style,
  resizeMode = "cover",
  ...props
}: Props) {
  const [source, setSource] = useState<ImageSourcePropType>(
    url ? { uri: url } : DEFAULT_IMAGE
  );

  const handleError = () => {
    if (source !== DEFAULT_IMAGE) {
      setSource(DEFAULT_IMAGE);
    }
  };

  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
      onError={handleError}
      {...props}
    />
  );
}