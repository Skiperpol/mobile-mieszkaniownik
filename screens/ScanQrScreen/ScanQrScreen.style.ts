import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#eff6ff',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  header: {
    gap: 8,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4b5563',
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraFrame: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  scanner: {
    flex: 1,
  },
  frameOverlay: {
    position: 'absolute',
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
  },
  frameBorder: {
    position: 'absolute',
    borderColor: '#60a5fa',
  },
  frameTop: {
    top: 16,
    left: 16,
    right: 16,
    borderTopWidth: 4,
  },
  frameBottom: {
    bottom: 16,
    left: 16,
    right: 16,
    borderBottomWidth: 4,
  },
  frameLeft: {
    top: 16,
    bottom: 16,
    left: 16,
    borderLeftWidth: 4,
  },
  frameRight: {
    top: 16,
    bottom: 16,
    right: 16,
    borderRightWidth: 4,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: '#111827',
  },
  statusTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusText: {
    color: '#d1d5db',
    fontSize: 15,
    textAlign: 'center',
  },
  permissionButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  errorText: {
    marginTop: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  loadingNotice: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#1f2937',
    fontSize: 15,
  },
  actions: {
    marginTop: 24,
  },
  backButton: {
    marginTop: 24,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
  },
});

export default styles;

