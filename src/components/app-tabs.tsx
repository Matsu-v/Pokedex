import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { FontSize } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.tabBar}
      iconColor={{ default: theme.tabInactive, selected: theme.tabActive }}
      labelStyle={{
        default: { color: theme.tabInactive, fontSize: FontSize.tab, fontWeight: '500' },
        selected: { color: theme.tabActive, fontSize: FontSize.tab, fontWeight: '700' },
      }}
      indicatorColor={theme.chip}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Pokémons</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/pokemons.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/favorites.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
