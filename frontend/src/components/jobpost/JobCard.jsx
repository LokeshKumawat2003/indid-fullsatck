import { Box, Text, HStack, Badge, IconButton, VStack } from "@chakra-ui/react"
import { FaStar, FaBolt, FaBookmark, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa"

export default function JobCard({ job, onClick }) {
  return (
    <Box
      borderWidth="0"
      borderLeftWidth="4px"
      borderLeftColor="blue.500"
      borderRadius="8px"
      p={5}
      mb={3}
      bg="gray.50"
      cursor="pointer"
      _hover={{ 
        bg: "white",
        shadow: "md"
      }}
      position="relative"
      transition="all 0.3s"
      onClick={() => onClick(job)}
    >
      <HStack justify="space-between" align="start" mb={4}>
        <VStack align="start" spacing={1} flex="1">
          <Text fontSize="lg" fontWeight="700" color="gray.800">
            {job.title}
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="500">
            {job.company}
          </Text>
        </VStack>
        
        <IconButton
          aria-label="Bookmark job"
          icon={<FaBookmark />}
          variant="ghost"
          size="sm"
          color="gray.400"
          _hover={{ color: "blue.500" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </HStack>

      <HStack spacing={4} mb={4} flexWrap="wrap">
        <HStack spacing={1.5}>
          <FaMapMarkerAlt color="#718096" size="12px" />
          <Text fontSize="sm" color="gray.600">
            {job.location}
          </Text>
        </HStack>
        
        {job.rating && (
          <HStack spacing={1.5}>
            <FaStar color="#F6AD55" size="12px" />
            <Text fontSize="sm" color="gray.700" fontWeight="600">
              {job.rating}
            </Text>
          </HStack>
        )}
        
        {job.responseTime && (
          <HStack spacing={1.5}>
            <FaBolt color="#3182CE" size="12px" />
            <Text fontSize="sm" color="gray.600">
              {job.responseTime}
            </Text>
          </HStack>
        )}
      </HStack>

      <HStack spacing={3} mb={3} flexWrap="wrap">
        <Text fontSize="md" fontWeight="700" color="green.600">
          {job.salary}
        </Text>
        {job.jobType && (
          <Badge
            colorScheme="blue"
            fontSize="xs"
            px={2.5}
            py={0.5}
            borderRadius="md"
            fontWeight="600"
          >
            {job.jobType}
          </Badge>
        )}
      </HStack>

      {job.benefits && job.benefits.length > 0 && (
        <VStack align="start" spacing={1.5}>
          {job.benefits.map((benefit, index) => (
            <HStack key={index} spacing={2}>
              <FaCheckCircle color="#48BB78" size="10px" />
              <Text fontSize="xs" color="gray.600">
                {benefit}
              </Text>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  )
}