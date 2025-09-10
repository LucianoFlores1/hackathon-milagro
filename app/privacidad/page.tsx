export default function Privacidad() {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Política de Privacidad</h1>
            <p className="mb-2">
                Esta plataforma es colaborativa y gratuita. Los datos publicados en los avisos son responsabilidad exclusiva de cada usuario.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>No publicamos ni compartimos información sensible (direcciones exactas, documentos, teléfonos de menores).</li>
                <li>Las zonas indicadas deben ser aproximadas para proteger la privacidad.</li>
                <li>Se recomienda coordinar encuentros en lugares públicos y seguros.</li>
                <li>Las fotos deben ser propias o contar con permiso.</li>
                <li>No utilizamos cookies para seguimiento ni recopilamos datos personales con fines comerciales.</li>
            </ul>
        </div>
    );
}
