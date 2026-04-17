-- Crear la tabla principal de configuraciones guardadas
CREATE TABLE builds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    config JSONB NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activar la seguridad por filas (RLS - Row Level Security)
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;

-- Crear política: Un usuario solo puede ver y cargar sus propias configuraciones
CREATE POLICY "Los usuarios pueden ver sus propios builds" 
ON builds FOR SELECT 
USING (auth.uid() = user_id);

-- Crear política: Un usuario solo puede insertar sus propias configuraciones
CREATE POLICY "Los usuarios pueden insertar sus propios builds" 
ON builds FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Crear política: Un usuario solo puede borrar sus propias configuraciones
CREATE POLICY "Los usuarios pueden borrar sus propios builds" 
ON builds FOR DELETE 
USING (auth.uid() = user_id);
