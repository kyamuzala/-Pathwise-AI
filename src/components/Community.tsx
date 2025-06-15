import React, { useState } from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  HStack,
  Tag,
  TagLabel,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaSearch, FaUserGraduate, FaUserTie } from 'react-icons/fa'

interface CommunityMember {
  id: string
  name: string
  role: 'mentor' | 'student'
  expertise: string[]
  bio: string
  avatar: string
}

const communityMembers: CommunityMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'mentor',
    expertise: ['Software Engineering', 'Career Development'],
    bio: 'Senior Software Engineer with 10+ years of experience. Passionate about mentoring the next generation of developers.',
    avatar: 'https://bit.ly/sarah-johnson',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'student',
    expertise: ['Computer Science', 'Web Development'],
    bio: 'Computer Science student interested in full-stack development and AI.',
    avatar: 'https://bit.ly/michael-chen',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'mentor',
    expertise: ['Data Science', 'Machine Learning'],
    bio: 'Data Scientist helping students navigate the world of AI and machine learning.',
    avatar: 'https://bit.ly/emily-rodriguez',
  },
]

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const filteredMembers = communityMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.expertise.some((exp) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg">Community</Heading>
          <Text color="gray.600">
            Connect with mentors and peers who share your interests
          </Text>
        </Box>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by name or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              bg={bgColor}
              borderWidth={1}
              borderColor={borderColor}
            >
              <CardHeader>
                <HStack spacing={4}>
                  <Avatar
                    name={member.name}
                    src={member.avatar}
                    size="lg"
                  />
                  <VStack align="start" spacing={1}>
                    <Heading size="md">{member.name}</Heading>
                    <HStack>
                      {member.role === 'mentor' ? (
                        <FaUserTie color="brand.500" />
                      ) : (
                        <FaUserGraduate color="brand.500" />
                      )}
                      <Text color="gray.600" textTransform="capitalize">
                        {member.role}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Text color="gray.600">{member.bio}</Text>
                  <HStack spacing={2} wrap="wrap">
                    {member.expertise.map((exp) => (
                      <Tag key={exp} colorScheme="brand" size="sm">
                        <TagLabel>{exp}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                  <Button
                    colorScheme="brand"
                    variant="outline"
                    width="full"
                  >
                    Connect
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default Community 