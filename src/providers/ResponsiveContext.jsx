import React, { createContext, useContext } from "react";
import { useMediaQuery } from "react-responsive";

const ResponsiveContext = createContext();

export const ResponsiveProvider = ({ children }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 480px)" });
  const isMobileLandscape = useMediaQuery({
    query: "(min-width: 481px) and (max-width: 767px)",
  });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1023px)",
  });
  const isTabletHD = useMediaQuery({
    query: "(min-width: 1024px) and (max-width: 1279px)",
  });
  const isDesktopHD = useMediaQuery({
    query: "(min-width: 1280px) and (max-width: 1440px)",
  });
  const isDesktopFullHD = useMediaQuery({ query: "(min-width: 1441px)" });

  return (
    <ResponsiveContext.Provider
      value={{
        isMobile,
        isMobileLandscape,
        isTablet,
        isTabletHD,
        isDesktopHD,
        isDesktopFullHD,
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useResponsive = () => {
  return useContext(ResponsiveContext);
};

/*
  1024 x 768 píxeles (4:3): monitores de 14 y 15″
  1280 x 1024 píxeles (4:3): monitores de 17 y 19″
  1600 x 1200 píxeles (4:3): monitores de 19 y 21″
  1280 x 800 píxeles (16:10): monitores de 17 y 19″
  1680 x 1050 píxeles (16:10): monitores de 19 y 21″
  1920 x 1200 píxeles (16:10): monitores de 22, 24, 26″
  2560 x 1600 píxeles (16:10): monitores por encima de 26″
  1280 x 720 píxeles (16:9): monitores de 17 y 19″. Conocido como resolución HD
  1366 x 768 píxeles (16:9): monitores de 17 y 19″
  1600 x 900 píxeles (16:9): monitores de 19 y 22″
  Resoluciones comunes
  Actualmente, es extremadamente raro encontrar un monitor con resolución inferior a 1920 x 1080, también denominada Full HD. Se ha establecido en la industria como la resolución base y de ahí, podemos encontrar resoluciones de mayor calidad. Estas son:
  
  1920 x 1080 píxeles (16:9): La podemos ver en monitores con un tamaño de hasta 32 pulgadas. Conocida como resolución Full HD.
  2560 x 1080 píxeles (21:9): Resolución de tipo panorámica que se suele ver en monitores de entre 25 y 29 pulgadas.
  2560 x 1440 píxeles (16:9): Se suele ver en monitores con un tamaño de entre 24 y 32 pulgadas. Conocida como resolución QHD.
  3440 x 1440 píxeles (21:9): Dicha resolución se suele quedar habitualmente para monitores de 34 pulgadas en adelante.
  2880 × 1800 píxeles (16:10): Únicamente se utiliza en monitores Apple de tamaño entre 21 y 27 pulgadas. Conocida como Retina Display.
  3840 x 2160 píxeles (16:9): Esta resolución está pensada para monitores de más de 27 pulgadas.  Conocida como resolución 4K o UHD.
  4096 × 2160 píxeles (17:9): No se utiliza en monitores, es una resolución que está reservada principalmente para proyectores. Conocida como 4K Cinema.
  5120 x 2160 píxeles (21:9): Aún no es muy habitual, pero normalmente se suele ver en monitores de 32 pulgadas en adelante.
  5120 x 2880 píxeles (16:9): Resolución poco habitual que se suele ver solamente en monitores con tamaño superior a las 40 pulgadas. Conocida como resolución 5K.
  7680 x 4320 píxeles (16:9): La oferta de monitores con esta resolución es mínima y, de momento, se reserva para opciones con un tamaño por encima de 50 pulgadas. Conocida como resolución 8K.
  7680 × 4800 píxeles (16:10): Poco habitual que solamente se ve en monitores y televisores por encima de 50 pulgadas.
  */
