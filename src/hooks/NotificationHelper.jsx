import { notification } from "antd";

export const SuccessNotificationMsg = (message, desc) => {
    return notification.success({
      message: message,
      description: desc,
      placement: "topRight",
      duration: 3.5,
    });
  };

export const ErrorNotificationMsg = (message, desc) => {
  return notification.error({
    message: message,
    description: desc,
    placement: "topRight",
    duration: 3.5,
  });
};
