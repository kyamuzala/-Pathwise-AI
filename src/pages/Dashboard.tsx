import React from 'react'
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  TagLabel,
  Progress,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import { FaRobot, FaChartLine, FaUsers, FaGraduationCap } from 'react-icons/fa'
import { useStore } from '../store/useStore'
import AIMentor from '../components/AIMentor'
import { useDisclosure } from '@chakra-ui/react'

const Dashboard = () => {
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editName, setEditName] = React.useState(user?.name || '')
  const [editAge, setEditAge] = React.useState(user?.age || 13)

  React.useEffect(() => {
    setEditName(user?.name || '')
    setEditAge(user?.age || 13)
  }, [user])

  const handleSave = () => {
    if (user) {
      setUser({ ...user, name: editName, age: editAge })
    }
    onClose()
  }

  const recommendations = [
    {
      title: 'Explore Computer Science',
      description: 'Based on your interest in Technology and Coding',
      icon: FaRobot,
    },
    {
      title: 'Join Math Club',
      description: 'Connect with peers who share your interests',
      icon: FaUsers,
    },
    {
      title: 'Try Programming',
      description: 'Start with Python basics',
      icon: FaChartLine,
    },
    {
      title: 'Research Universities',
      description: 'Look into STEM programs',
      icon: FaGraduationCap,
    },
  ]

  if (!user) {
    return <Text>Loading...</Text>
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={8}>
        {/* Profile Sidebar */}
        <GridItem>
          <VStack spacing={6}>
            <Card>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Heading size="md">{user.name}</Heading>
                  <Text color="gray.600">Age: {user.age}</Text>
                  
                  <Box width="100%">
                    <Text mb={2}>Profile Completion</Text>
                    <Progress value={70} colorScheme="brand" />
                  </Box>

                  <Box width="100%">
                    <Text mb={2}>Interests</Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {user.interests.map((interest) => (
                        <Tag key={interest} colorScheme="brand" size="sm">
                          <TagLabel>{interest}</TagLabel>
                        </Tag>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Button width="100%" colorScheme="brand" variant="outline" onClick={onOpen}>
                    Edit Profile
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <AIMentor />
          </VStack>
        </GridItem>

        {/* Main Content */}
        <GridItem>
          <VStack spacing={8} align="stretch">
            <Box>
              <Heading size="lg" mb={4}>
                Welcome back, {user.name}!
              </Heading>
              <Text color="gray.600">
                Here are some personalized recommendations based on your interests.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <HStack>
                      <Box
                        p={2}
                        bg="brand.50"
                        color="brand.500"
                        borderRadius="md"
                      >
                        <rec.icon />
                      </Box>
                      <Heading size="md">{rec.title}</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Text color="gray.600">{rec.description}</Text>
                    <Button
                      mt={4}
                      colorScheme="brand"
                      variant="ghost"
                      size="sm"
                    >
                      Learn More
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Age</FormLabel>
              <NumberInput min={10} max={100} value={editAge} onChange={(_, v) => setEditAge(v)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default Dashboard 