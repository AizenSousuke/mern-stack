FROM reactnativecommunity/react-native-android

RUN sdkmanager --install "system-images;android-30;google_apis;arm64-v8a"
RUN echo no | avdmanager create avd --name Pixel_4_API_30 -k "system-images;android-30;google_apis;arm64-v8a"

WORKDIR /app

COPY . .