export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Here you would typically delete the task from your database
    // For now, we'll just return a success response
    
    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
