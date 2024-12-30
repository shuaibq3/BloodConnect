import React, { useState, useCallback, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions, ViewStyle, StyleProp, Image, ImageStyle, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../setup/theme/hooks/useTheme'
import { Theme } from '../../setup/theme'
import { Button } from '../button/Button'
import { DonationData } from '../../donationWorkflow/donationPosts/useDonationPosts'
import { UrgencyLevel } from '../../donationWorkflow/types'
import BloodImage from '../../../assets/images/bloodtype.png'
import StatusBadge from './StatusBadge'

export interface PostCardDisplayOptions {
  showContactNumber?: boolean;
  showDescription?: boolean;
  showTransportInfo?: boolean;
  showPatientName?: boolean;
  showButton?: boolean;
  showHeader?: boolean;
  showOptions?: boolean;
  showPostUpdatedOption?: boolean;
  showStatus?: boolean;
}

interface PostCardProps extends PostCardDisplayOptions {
  post: DonationData;
  updateHandler?: (donationData: DonationData) => void;
  detailHandler?: (donationData: DonationData) => void;
  cancelHandler?: (donationData: DonationData) => void;
}

interface DropdownPosition {
  top: number;
  right: number;
}

export const PostCard: React.FC<PostCardProps> = React.memo(({
  post,
  updateHandler,
  detailHandler,
  cancelHandler,
  showContactNumber = false,
  showDescription = true,
  showTransportInfo = false,
  showPatientName = false,
  showButton = true,
  showHeader = true,
  showOptions = true,
  showPostUpdatedOption = true,
  showStatus = false
}) => {
  const theme = useTheme()
  const styles = createStyles(theme)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, right: 0 })
  const iconRef = useRef<View>(null)
  const { height: windowHeight } = Dimensions.get('window')

  const handleToggleDropdown = useCallback(() => {
    if (!showDropdown && (iconRef.current != null)) {
      iconRef.current.measureInWindow((_, pageY, __, height) => {
        const top = pageY + height
        const adjustedTop = Math.min(top, windowHeight - 100)
        setDropdownPosition({
          top: adjustedTop,
          right: 20
        })
      })
    }
    setShowDropdown(prev => !prev)
  }, [showDropdown, windowHeight])

  const handleCloseDropdown = useCallback(() => {
    setShowDropdown(false)
  }, [])

  const handleUpdate = useCallback(() => {
    updateHandler !== undefined && updateHandler(post)
    handleCloseDropdown()
  }, [post, updateHandler])

  const handleCancel = useCallback(() => {
    cancelHandler !== undefined && cancelHandler(post)
    handleCloseDropdown()
  }, [post, cancelHandler])

  const formatDateTime = (date: string) => {
    const dateObj = new Date(date)

    const timeStr = dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    const day = dateObj.getDate()
    const month = dateObj.toLocaleString('en-US', { month: 'short' })
    const year = dateObj.getFullYear()

    return `${timeStr}, ${day} ${month} ${year}`
  }
  const OpenLocation = ({ location }: { location: string }) => {
    const url = `https://www.google.com/maps?q=${encodeURIComponent(location)}`
    Linking.openURL(url).catch(() => { Alert.alert('Error', 'Failed to open the map. Please try again.') })
  }

  const getDropdownStyle = useCallback((): ViewStyle => ({
    ...styles.dropdownContainer,
    top: dropdownPosition.top,
    right: dropdownPosition.right
  }), [dropdownPosition])

  return (
      <View style={styles.card}>
        {showHeader &&
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.userName}>{post.patientName}</Text>
              <Text style={styles.postTime}>Posted on {formatDateTime(post.createdAt)}</Text>
            </View>
            {showStatus && <StatusBadge status={post.status} />}
            {showOptions &&
            <View style={styles.menuContainer}>
              <View ref={iconRef} collapsable={false}>
                <TouchableOpacity
                  onPress={handleToggleDropdown}
                  style={styles.iconContainer}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.grey} />
                </TouchableOpacity>
              </View>

              <Modal
                visible={showDropdown}
                transparent
                animationType="none"
                onRequestClose={handleCloseDropdown}
              >
                <TouchableWithoutFeedback onPress={handleCloseDropdown}>
                  <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                      <View style={getDropdownStyle()}>
                        <TouchableOpacity
                          onPress={handleUpdate}
                          style={styles.dropdownItem}
                        >
                          <Text style={styles.dropdownText}>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleCancel}
                          style={styles.dropdownItem}
                        >
                          <Text style={styles.dropdownText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>}
          </View>
        }
        <View style={styles.bloodInfoWrapper}>
          <View style={styles.bloodInfo}>
            <View style={styles.bloodRow}>
            <Image source={BloodImage} style={styles.bloodImage as StyleProp<ImageStyle>} />
              <View style={styles.bloodText}>
                <Text style={styles.lookingForText}>Looking for</Text>
                <Text style={styles.bloodAmount}>{post.bloodQuantity} {post.requestedBloodGroup} (ve) blood</Text>
              </View>
            </View>
            {post.urgencyLevel === UrgencyLevel.URGENT && (
              <View style={styles.urgentBadge}>
                <Ionicons name="warning-outline" size={14} color={theme.colors.black} />
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}
          </View>

          <View style={styles.locationTimeContainer}>
            <View style={styles.locationTimeWrapper}>
              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Ionicons name="location-outline" size={16} color={theme.colors.grey} />
                  <Text style={styles.donationInfoPlaceholder}>Donation point</Text>
                </View>
                <TouchableOpacity onPress={() => { OpenLocation({ location: post.location }) }}>
                <Text style={[styles.description, styles.link]}>{post.location}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.locationTimeWrapper, styles.noBorder]}>
              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.grey} />
                  <Text style={styles.donationInfoPlaceholder}>Time & Date</Text>
                </View>
                <Text style={styles.description}>{formatDateTime(post.donationDateTime)}</Text>
              </View>
            </View>
          </View>
          {post.contactNumber !== '' && showContactNumber &&
            <View style={styles.descriptionContainer}>
              <Text style={styles.donationInfoPlaceholder}>Contact Number</Text>
              <Text style={styles.description}>{post.contactNumber}</Text>
            </View>
          }
          {post.patientName !== '' && showPatientName &&
            <View style={styles.descriptionContainer}>
              <Text style={styles.donationInfoPlaceholder}>Name of the Patient</Text>
              <Text style={styles.description}>{post.patientName}</Text>
            </View>
          }

          {post.shortDescription !== '' && showDescription &&
            <View style={styles.descriptionContainer}>
              <Text style={styles.donationInfoPlaceholder}>Short Description of the Problem</Text>
              <Text style={styles.description}>{post.shortDescription}</Text>
            </View>
          }
          {post.transportationInfo !== '' && showTransportInfo &&
            <View style={styles.descriptionContainer}>
              <Text style={styles.donationInfoPlaceholder}>Transportation Facility for the Donor</Text>
              <Text style={styles.description}>{post.transportationInfo}</Text>
            </View>
          }
        </View>
        {Array.isArray(post.acceptedDonors) && post.acceptedDonors.length > 0 && showPostUpdatedOption && <>
          <Text style={styles.bloodAmount}>Post Update</Text>
          <View style={[styles.bloodInfoWrapper, styles.postUpdate]}>
            <Ionicons name='time-outline' size={20} color={theme.colors.grey} />
            <View>
              <Text style={styles.donationInfoPlaceholder}>Number of Donors</Text>
              <Text style={styles.bloodAmount}>{post.acceptedDonors.length} donors accepted your request</Text>
            </View>
          </View>
        </>}
        {showButton && <View style={styles.buttonContainer}>
          <Button
            text='View details'
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            onPress={() => { detailHandler !== undefined && detailHandler(post) }}
          />
        </View>}
      </View>
  )
})

const createStyles = (theme: Theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    padding: 18,
    marginBottom: 10,
    position: 'relative'
  },
  link: {
    textDecorationLine: 'underline'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  postTime: {
    color: theme.colors.grey,
    fontSize: 12
  },
  menuContainer: {
    position: 'relative'
  },
  iconContainer: {
    padding: 8,
    marginRight: -8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  bloodImage: {
    width: 28,
    height: 28
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 120
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  dropdownText: {
    color: theme.colors.black,
    fontSize: 14
  },
  bloodInfoWrapper: {
    borderRadius: 5,
    borderColor: theme.colors.extraLightGray,
    borderWidth: 1,
    marginBottom: 8
  },
  postUpdate: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    gap: 8,
    marginTop: 8
  },
  bloodInfo: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: theme.colors.extraLightGray,
    borderBottomWidth: 1
  },
  bloodRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bloodText: {
    marginLeft: 8
  },
  lookingForText: {
    fontSize: 13,
    color: theme.colors.textSecondary
  },
  bloodAmount: {
    fontSize: 15,
    fontWeight: '500'
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.goldenYellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  urgentText: {
    color: theme.colors.black,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4
  },
  locationTimeContainer: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  locationTimeWrapper: {
    width: '50%',
    borderRightColor: theme.colors.extraLightGray,
    borderRightWidth: 1
  },
  noBorder: {
    borderRightWidth: 0
  },
  infoSection: {
    padding: 8
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  donationInfoPlaceholder: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4
  },
  descriptionContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.extraLightGray
  },
  description: {
    fontSize: 16,
    marginTop: 4
  },
  buttonContainer: {
    marginTop: 9,
    width: '100%'
  },
  buttonStyle: {
    paddingVertical: 10,
    backgroundColor: theme.colors.extraLightGray
  },
  textStyle: {
    color: theme.colors.textPrimary
  }
})

export default PostCard
