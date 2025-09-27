import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  Text,
} from "@chakra-ui/react";

const CustomModal = ({
  isOpen,
  onClose,
  title,
  description,
  primaryAction,
  secondaryAction,
  primaryLabel = "Confirm",
  secondaryLabel = "Cancel",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent
        bg="white"
        borderRadius="16px"
        boxShadow="0 10px 40px rgba(0, 0, 0, 0.1)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        maxWidth="500px"
        mx={4}
        _dark={{
          bg: "gray.800",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <ModalHeader fontSize="xl" fontWeight="bold" color="blue.600" pb={2}>
          {title}
        </ModalHeader>

        <ModalCloseButton
          mt={2}
          mr={2}
          color="gray.500"
          aria-label="Close modal"
          _hover={{ color: "red.500", bg: "red.50", borderRadius: "full" }}
        />

        <ModalBody pt={0} px={6}>
          <VStack spacing={4} align="stretch" textAlign="center">
            <Text color="gray.700" fontSize="md" lineHeight="tall">
              {description}
            </Text>
            <VStack spacing={3} width="full">
              {primaryAction && (
                <Button
                  colorScheme="blue"
                  onClick={primaryAction}
                  width="full"
                  py={3}
                  borderRadius="10px"
                  boxShadow="md"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  {primaryLabel}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="outline"
                  colorScheme="gray"
                  onClick={secondaryAction}
                  width="full"
                  py={3}
                  borderRadius="10px"
                  _hover={{ bg: "gray.50", transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                >
                  {secondaryLabel}
                </Button>
              )}
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center" pt={2} pb={6}>
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Choose wisely. The action you take here can’t be undone.
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
