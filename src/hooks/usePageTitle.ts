import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';

function usePageTitle(title: string): void {
  const [setPageTitle] = useOutletContext<[(title: string) => void]>();

  useEffect(() => {
    setPageTitle(title);

    return () => setPageTitle("");
  }, [title, setPageTitle]);

  // useEffect(() => () => {
  //   if (!prevailOnUnmount) {
  //     document.title = defaultTitle.current;
  //   }
  // }, [])
}

export default usePageTitle