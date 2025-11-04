export const safeRemoveElement = (element) => {
  try {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      return true;
    }
  } catch (error) {
    console.warn('Could not remove element:', error);
  }
  return false;
};

export const safeRemoveElements = (selector) => {
  try {
    const elements = document.querySelectorAll(selector);
    let removedCount = 0;
    
    elements.forEach(element => {
      if (safeRemoveElement(element)) {
        removedCount++;
      }
    });
    
    return removedCount;
  } catch (error) {
    console.warn('Could not remove elements with selector:', selector, error);
    return 0;
  }
};

export const closeAllMenus = () => {
  // Only close dropdown menus, not sidebar or other fixed elements
  // Look for specific menu containers that have data-menu attribute
  return safeRemoveElements('[data-note-menu="true"]');
};