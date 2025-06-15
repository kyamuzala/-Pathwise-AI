import { Box, Container, Flex, Heading, Button, useColorMode } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaMoon, FaSun } from 'react-icons/fa'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box minH="100vh">
      <Box as="header" py={4} borderBottom="1px" borderColor="gray.200">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading as={RouterLink} to="/" size="lg" color="brand.500">
              Pathwise AI
            </Heading>
            <Flex gap={4} align="center">
              <Button
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
              >
                {colorMode === 'light' ? <FaMoon /> : <FaSun />}
              </Button>
              <Button as={RouterLink} to="/login" variant="ghost">
                Login
              </Button>
              <Button as={RouterLink} to="/signup" variant="solid">
                Get Started
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  )
}

export default MainLayout 