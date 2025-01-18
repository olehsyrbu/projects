import { useState, useEffect, useRef, createContext, useContext } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useScreen } from '@/core/hooks';

const HashContext = createContext({ currentHash: '' });

export function Navigation({ children, ...props }) {
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [isScrolling, setIsScrolling] = useState(false);

  const navigationRef = useRef(null);
  const isMediumScreen = useScreen('md');

  useEffect(() => {
    const sections = document.querySelectorAll('h2[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentHash(`#${entry.target.id}`);
            scrollToActiveLink(`#${entry.target.id}`);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -95% 0px',
        threshold: 0,
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [isScrolling]);

  function handleScrollTo(href) {
    setIsScrolling(true);
    document.querySelector(href)?.scrollIntoView({ inline: 'nearest' });
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  }

  function scrollToActiveLink(hash) {
    if (!isMediumScreen) {
      setTimeout(() => {
        const activeLink = navigationRef.current.querySelector(`a[href="${hash}"]`);
        if (activeLink) {
          activeLink.scrollIntoView({ block: 'nearest' });
        }
      }, 300);
    }
  }

  return (
    <HashContext.Provider value={{ currentHash, scrollTo: handleScrollTo }}>
      <div
        ref={navigationRef}
        {...props}
        className="top-0 z-10 flex w-full space-x-4 overflow-auto border-y border-graphics-30 bg-white p-1 scrollbar-hide max-md:sticky md:rounded-full md:border-x"
      >
        {children}
      </div>
    </HashContext.Provider>
  );
}

export function AnchorLink({ href, children }) {
  const { currentHash, scrollTo } = useContext(HashContext);
  let [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(!document.querySelector(href));
  }, [href]);

  return !hidden ? (
    <a
      href={href}
      className={cn(
        'whitespace-nowrap px-3 py-2.5 text-sm font-medium text-p-100 first:pl-6 last:pr-6 hover:text-p-120',
        {
          'rounded-full bg-p-100 px-6 text-white hover:text-white': currentHash === href,
        },
      )}
      onClick={(event) => {
        event.preventDefault();
        scrollTo(href);
      }}
    >
      {children}
    </a>
  ) : null;
}

AnchorLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};
