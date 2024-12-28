export async function DELETE(request, context) {
  try {
    const id = context.params.id

    // Here you would typically delete the task from your database
    // For now, we'll just return a success response
    return new Response(JSON.stringify({ message: 'Task deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
