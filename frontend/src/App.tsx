import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, TextField, Card, CardContent, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://loremflickr.com/g/1200/400/cryptocurrency?lock=1)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8),
  marginBottom: theme.spacing(4),
}));

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onSubmit = async (data: { title: string; body: string; author: string }) => {
    setIsLoading(true);
    try {
      await backend.createPost(data.title, data.body, data.author);
      await fetchPosts();
      setShowForm(false);
      reset();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5">
          Explore the latest in cryptocurrency news and insights
        </Typography>
      </HeroSection>

      <Box mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create New Post'}
        </Button>
      </Box>

      {showForm && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: 'Title is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="body"
                control={control}
                defaultValue=""
                rules={{ required: 'Body is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Body"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="author"
                control={control}
                defaultValue=""
                rules={{ required: 'Author is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Author"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {posts.map((post) => (
        <Card key={Number(post.id)} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
            </Typography>
            <Typography variant="body1">{post.body}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default App;
