export const useNavigationData = (userId: string | undefined) => {
  const pageState = localStorage.getItem(userId || '');
  const { classicFinished, quoteFinished, imageFinished } = pageState
    ? JSON.parse(pageState)
    : {};

  const getNavigationUrl = () => {
    if (classicFinished && quoteFinished && imageFinished) {
      return '/scoreboards';
    } else if (!classicFinished) {
      return '/classic';
    } else if (!quoteFinished) {
      return '/quote';
    } else {
      return '/image';
    }
  };

  const getNavigationLabel = () => {
    if (classicFinished && quoteFinished && imageFinished) {
      return 'Jump to Scoreboard';
    } else if (!classicFinished) {
      return 'Classic';
    } else if (!quoteFinished) {
      return 'Quote';
    } else {
      return 'Image';
    }
  };

  return {
    navigationUrl: getNavigationUrl(),
    label: getNavigationLabel(),
  };
};
