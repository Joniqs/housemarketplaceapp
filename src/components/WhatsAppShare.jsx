import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { WhatsappShareButton } from 'react-share';

const WhatsAppShare = ({ url, title }) => {
  return (
    <WhatsappShareButton url={url} title={title}>
      <FaWhatsapp size={32} round={true} />
    </WhatsappShareButton>
  );
};

export default WhatsAppShare;
