export function SimpleFallback() {
  console.log('SimpleFallback: Rendering fallback component');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      color: 'black',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>Simple Fallback Component</h1>
      <p>This is a test component to see if basic rendering works.</p>
      <p>If you can see this, the app can render basic content.</p>
    </div>
  );
} 