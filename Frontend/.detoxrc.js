/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 5 * 60 * 1000
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/yasgba.app',
      build: 'xcodebuild -workspace ios/yasgba.xcworkspace -scheme yasgba -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/yasgba.app',
      build: 'xcodebuild -workspace ios/yasgba.xcworkspace -scheme yasgba -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug.mac': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug --warning-mode all && cd ..',
      reversePorts: [
        8081
      ]
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && .\\gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug --warning-mode all && cd ..',
      reversePorts: [
        8081
      ]
    },
    'android.release.mac': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release --warning-mode all && cd ..',
      reversePorts: [
        8081
      ]
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && .\\gradlew assembleRelease assembleAndroidTest -DtestBuildType=release --warning-mode all && cd ..',
      reversePorts: [
        8081
      ]
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14'
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*' // any attached device
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        // avdName: 'Pixel_4_API_30'
        avdName: 'Pixel_6_Pro_API_33'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
      binaryPath: 'bin/Exponent.app',
      type: 'ios.simulator',
      name: 'iPhone 14'
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release'
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug'
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release'
    }
  }
};
