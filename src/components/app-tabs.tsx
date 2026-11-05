import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { FontSize, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.tabBar}
      iconColor={{ default: theme.tabInactive, selected: theme.tabActive }}
      labelStyle={{
        // Android has one family for both states, the default one: there the active label is not bold.
        default: { color: theme.tabInactive, fontFamily: Fonts.medium, fontSize: FontSize.tab },
        selected: { color: theme.tabActive, fontFamily: Fonts.bold, fontSize: FontSize.tab },
      }}
      disableIndicator>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Pokémons</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/images/tabIcons/pokemons-outline.png'),
            selected: require('@/assets/images/tabIcons/pokemons.png'),
          }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/images/tabIcons/favorites.png'),
            selected: require('@/assets/images/icons/favorite-active.png'),
          }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
