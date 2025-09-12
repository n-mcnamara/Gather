import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import { NDKEvent } from '@nostr-dev-kit/ndk';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lon: number;
  communities: NDKEvent[];
}

export default function CreateEventModal({ isOpen, onClose, lat, lon, communities }: CreateEventModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <CreateEventForm lat={lat} lon={lon} onClose={onClose} communities={communities} />
    </Modal>
  );
}
