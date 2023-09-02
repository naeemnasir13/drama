import AsyncStorage from '@react-native-async-storage/async-storage';

const Cache = {
  /**
   * Saves the data into the phone's async storage
   */
  async set(key: string, data: any) {
    try {
      const jsonValue = JSON.stringify({
        data,
      });
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Fetches the data from async storage.
   * If data does not exist or expired, return null.
   */
  async get<T>(key: string): Promise<T | null> {
    let jsonString;
    try {
      jsonString = await AsyncStorage.getItem(key);
    } catch (e) {
      console.error(e);
    }
    if (jsonString) {
      const dataObject = JSON.parse(jsonString) as {
        data: T;
      };

      return dataObject.data;
    } else {
      return null;
    }
  },

  /**
   * Deletes the data from the phone's async storage
   */
  async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  },
};

export default Cache;
