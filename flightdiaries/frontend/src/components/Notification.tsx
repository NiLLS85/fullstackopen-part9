interface NotificationProps {
  message: string | null;
}

const Notification = ({ message }: NotificationProps) => {
  if (!message) {
    return null;
  }
  return <p className="error">{message}</p>;
};

export default Notification;
