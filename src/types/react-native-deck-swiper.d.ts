declare module 'react-native-deck-swiper' {
  import { ComponentType } from 'react';
  type Card = any;

  export interface SwiperProps {
    cards?: Card[];
    renderCard?: (card: Card, index?: number) => any;
    cardIndex?: number;
    backgroundColor?: string;
    stackSize?: number;
    infinite?: boolean;
    containerStyle?: any;
    animateOverlayLabelsOpacity?: boolean;
    animateCardOpacity?: boolean;
    overlayLabels?: any;
    [key: string]: any;
  }

  const Swiper: ComponentType<SwiperProps>;
  export default Swiper;
}
