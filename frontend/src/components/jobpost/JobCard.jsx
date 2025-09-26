import { Box, Text, HStack, Badge, IconButton, VStack } from "@chakra-ui/react"
import { FaStar, FaBolt, FaChevronRight, FaBookmark } from "react-icons/fa"

export default function JobCard({ job, onClick }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="12px"
      p={5}
      mb={3}
      bg="white"
      cursor="pointer"
      _hover={{ shadow: "sm" }}
      position="relative"
      borderColor="gray.300"
      shadow="sm"
      onClick={() => onClick(job)}  // Add onClick handler
    >
      <IconButton
        aria-label="Bookmark job"
        icon={<FaBookmark />}
        variant="ghost"
        size="sm"
        position="absolute"
        top={4}
        right={4}
        color="gray.400"
        _hover={{ color: "gray.600" }}
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering card click
          // Add bookmark logic if needed
        }}
      />

      <Text fontSize="lg" fontWeight="600" color="gray.900" mb={2} pr={10}>
        {job.title}
      </Text>

      <HStack spacing={2} mb={1}>
        <Text fontSize="sm" color="gray.700" fontWeight="500">
          {job.company}
        </Text>
        {job.rating && (
          <HStack spacing={1}>
            <Text fontSize="sm" color="gray.700" fontWeight="500">
              {job.rating}
            </Text>
            <FaStar color="#F6AD55" size="12px" />
          </HStack>
        )}
      </HStack>

      <Text fontSize="sm" color="gray.600" mb={3}>
        {job.location}
      </Text>

      {job.responseTime && (
        <HStack spacing={2} mb={4}>
          <FaBolt color="#3182CE" size="12px" />
          <Text fontSize="sm" color="gray.600">
            {job.responseTime}
          </Text>
        </HStack>
      )}

      <HStack spacing={3} mb={2} flexWrap="wrap" align="center">
        <Text fontSize="sm" fontWeight="600" color="gray.800">
          {job.salary}
        </Text>
        {job.jobType.map((type, index) => (
          <Badge
            key={index}
            bg="gray.100"
            color="gray.700"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="4px"
            fontWeight="500"
          >
            {type}
          </Badge>
        ))}
      </HStack>

      {job.benefits && job.benefits.length > 0 && (
        <VStack align="start" spacing={2} mb={4}>
          {job.benefits.map((benefit, index) => (
            <Text key={index} fontSize="sm" color="gray.600">
              {benefit}
            </Text>
          ))}
        </VStack>
      )}

      {/* {job.easyApply && (
        <HStack spacing={2} color="blue.600" mt={3}>
          <FaChevronRight size="10px" />
          <Text fontSize="sm" fontWeight="500">
            Easily apply
          </Text>
        </HStack>
      )} */}
    </Box>
  )
}
