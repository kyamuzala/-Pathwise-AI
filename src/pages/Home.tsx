import { Box, Button, Container, Heading, Text, SimpleGrid, Icon, VStack, useColorModeValue } from '@chakra-ui/react'
import { FaRobot, FaChartLine, FaUsers, FaGraduationCap } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'

const features = [
  {
    icon: FaRobot,
    title: 'Personal AI Mentor',
    description: 'Your persistent AI companion that learns and grows with you, adapting to your unique journey.',
  },
  {
    icon: FaChartLine,
    title: 'Interest & Skill Mapping',
    description: 'Discover your natural talents and interests through engaging assessments and interactive activities.',
  },
  {
    icon: FaUsers,
    title: 'Community & Mentorship',
    description: 'Connect with peers and professionals who share your interests and can guide your path.',
  },
  {
    icon: FaGraduationCap,
    title: 'Dynamic Pathway Explorer',
    description: 'Visualize your potential career paths and explore different educational routes.',
  },
]

const Home = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="center" textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
            >
              Your Personal Study & Career Navigator
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl">
              Discover your path with AI-powered guidance that adapts to your age, interests, and goals.
              Start your journey to a fulfilling future today.
            </Text>
            <Button
              as={RouterLink}
              to="/signup"
              size="lg"
              colorScheme="brand"
              px={8}
            >
              Get Started
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {features.map((feature, index) => (
            <VStack
              key={index}
              align="start"
              p={6}
              bg={bgColor}
              rounded="lg"
              shadow="sm"
            >
              <Icon as={feature.icon} w={10} h={10} color="brand.500" />
              <Heading size="md">{feature.title}</Heading>
              <Text color={textColor}>{feature.description}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default Home 