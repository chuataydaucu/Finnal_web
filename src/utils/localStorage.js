export const getFromLS = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    if (data === null || data === "null" || data === "undefined") {
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(`Lỗi đọc dữ liệu ${key} từ localStorage:`, error);
    return defaultValue;
  }
};

export const saveToLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Lỗi lưu dữ liệu ${key} vào localStorage:`, error);
  }
};

export const removeFromLS = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Lỗi xóa dữ liệu ${key} từ localStorage:`, error);
  }
};
