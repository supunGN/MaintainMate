import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { MoreVertical, Phone } from 'lucide-react-native';
import React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface Contact {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  image?: ImageSourcePropType;
  category?: string;
}

interface ContactCardProps {
  contact: Contact;
  onPress?: () => void;
  onMenuPress?: () => void;
}

export default function ContactCard({
  contact,
  onPress,
  onMenuPress,
}: ContactCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon/Image */}
      <View style={styles.iconContainer}>
        {contact.image ? (
          <Image source={contact.image} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Phone size={20} color={Colors.neutral.gray600} />
          </View>
        )}
      </View>

      {/* Contact Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.specialty}>{contact.specialty}</Text>
        <Text style={styles.phone}>{contact.phone}</Text>
      </View>

      {/* Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <MoreVertical size={20} color={Colors.neutral.gray600} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.gray100,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: Spacing.borderRadius.md,
  },
  placeholder: {
    width: 48,
    height: 48,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: Colors.neutral.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: Typography.fontSize.body,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  specialty: {
    fontSize: Typography.fontSize.caption,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  phone: {
    fontSize: Typography.fontSize.caption,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
  },
  menuButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
