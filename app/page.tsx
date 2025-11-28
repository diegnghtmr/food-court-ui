import Link from "next/link"
import { redirect } from "next/navigation"
import { UtensilsCrossed, Users, ChefHat, Truck, ShieldCheck, Clock, Zap, ArrowRight } from "lucide-react"

export default function HomePage() {
  redirect("/login")

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono">
      {/* Hero Section */}
      <section className="py-20 border-b-4 border-[#8b5cf6]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-6 tracking-tight">
                PLAZOLETA
                <br />
                <span className="text-[#8b5cf6]">DE</span>
                <br />
                <span className="text-[#22c55e]">COMIDAS</span>
              </h1>
              <p className="text-lg font-bold mb-8 max-w-lg uppercase tracking-wide text-[#a0a0a0]">
                SISTEMA DE GESTIÓN INTEGRAL PARA ADMINISTRADORES, PROPIETARIOS, EMPLEADOS Y CLIENTES.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/plazoleta/login">
                  <button className="bg-[#8b5cf6] text-black border-4 border-[#e0e0e0] font-black uppercase text-lg px-8 py-4 shadow-[6px_6px_0px_0px_#e0e0e0] hover:shadow-[2px_2px_0px_0px_#e0e0e0] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2">
                    INICIAR SESIÓN
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <Link href="/plazoleta/registro">
                  <button className="bg-transparent text-[#e0e0e0] border-4 border-[#e0e0e0] font-black uppercase text-lg px-8 py-4 shadow-[6px_6px_0px_0px_#8b5cf6] hover:bg-[#1a1a1a] transition-all">
                    REGISTRARSE
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#1a1a1a] border-4 border-[#8b5cf6] p-8 shadow-[12px_12px_0px_0px_#22c55e] transform rotate-1">
                <div className="bg-[#0a0a0a] border-4 border-[#e0e0e0] p-6 transform -rotate-1">
                  <div className="flex items-center gap-4 mb-4">
                    <UtensilsCrossed className="h-12 w-12 text-[#8b5cf6]" />
                    <div>
                      <div className="text-3xl font-black uppercase text-[#22c55e]">API REST</div>
                      <div className="font-bold uppercase text-sm text-[#a0a0a0]">MICROSERVICIOS</div>
                    </div>
                  </div>
                  <div className="text-sm font-mono text-[#22c55e] bg-[#1a1a1a] p-2 border-2 border-[#22c55e]">
                    $ STATUS: ONLINE_
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-[#121212]">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-black uppercase text-center mb-16">
            ROLES DEL <span className="text-[#8b5cf6]">SISTEMA</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "ADMINISTRADOR",
                description: "GESTIONA PROPIETARIOS Y RESTAURANTES DEL SISTEMA",
                color: "#f97316",
              },
              {
                icon: ChefHat,
                title: "PROPIETARIO",
                description: "ADMINISTRA PLATOS, EMPLEADOS Y REPORTES DE SU RESTAURANTE",
                color: "#8b5cf6",
              },
              {
                icon: Users,
                title: "EMPLEADO",
                description: "GESTIONA PEDIDOS CON TABLERO KANBAN Y FLUJO DE ESTADOS",
                color: "#22c55e",
              },
              {
                icon: Truck,
                title: "CLIENTE",
                description: "EXPLORA MENÚS, REALIZA PEDIDOS Y RASTREA ENTREGAS",
                color: "#06b6d4",
              },
            ].map((role, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] border-4 border-[#e0e0e0] p-6 shadow-[6px_6px_0px_0px] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px] transition-all"
                style={{
                  boxShadow: `6px 6px 0px 0px ${role.color}`,
                }}
              >
                <role.icon className="h-10 w-10 mb-4" style={{ color: role.color }} />
                <h3 className="text-xl font-black uppercase mb-3" style={{ color: role.color }}>
                  {role.title}
                </h3>
                <p className="font-bold text-sm text-[#a0a0a0] uppercase">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-y-4 border-[#22c55e]">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-black uppercase text-center mb-16">
            CARACTERÍSTICAS <span className="text-[#22c55e]">PRINCIPALES</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AUTENTICACIÓN JWT",
                description: "SEGURIDAD CON TOKENS BEARER Y GUARDS DE RUTAS POR ROL",
              },
              {
                icon: Clock,
                title: "TIEMPO REAL",
                description: "ACTUALIZACIÓN AUTOMÁTICA DE ESTADOS DE PEDIDOS CADA 5 SEGUNDOS",
              },
              {
                icon: UtensilsCrossed,
                title: "CÓDIGO PIN",
                description: "VALIDACIÓN SEGURA EN LA ENTREGA DE PEDIDOS AL CLIENTE",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] border-4 border-[#22c55e] p-8 shadow-[8px_8px_0px_0px_#8b5cf6] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#8b5cf6] transition-all"
              >
                <feature.icon className="h-12 w-12 mb-4 text-[#22c55e]" />
                <h3 className="text-xl font-black uppercase mb-4 text-[#e0e0e0]">{feature.title}</h3>
                <p className="font-bold text-[#a0a0a0] uppercase text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#8b5cf6]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { number: "4", label: "MICROSERVICIOS" },
              { number: "4", label: "ROLES DE USUARIO" },
              { number: "5", label: "ESTADOS DE PEDIDO" },
              { number: "100%", label: "API REST" },
            ].map((stat, index) => (
              <div key={index} className="bg-[#0a0a0a] border-4 border-[#e0e0e0] p-6 shadow-[6px_6px_0px_0px_#e0e0e0]">
                <div className="text-4xl font-black mb-2 text-[#22c55e]">{stat.number}</div>
                <div className="font-bold uppercase text-sm text-[#a0a0a0]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">
            ACCEDE AL
            <br />
            <span className="text-[#8b5cf6]">SISTEMA</span>
          </h2>
          <p className="text-lg font-bold mb-12 text-[#a0a0a0] max-w-2xl mx-auto uppercase">
            INICIA SESIÓN PARA GESTIONAR RESTAURANTES, PEDIDOS Y MÁS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plazoleta/login">
              <button className="bg-[#22c55e] text-black border-4 border-[#e0e0e0] font-black uppercase px-10 py-4 shadow-[6px_6px_0px_0px_#e0e0e0] hover:shadow-[2px_2px_0px_0px_#e0e0e0] hover:translate-x-1 hover:translate-y-1 transition-all">
                ENTRAR AHORA
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t-4 border-[#8b5cf6] bg-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="font-bold uppercase text-sm text-[#a0a0a0]">
            PLAZOLETA DE COMIDAS &copy; 2025 — SISTEMA DE GESTIÓN
          </p>
        </div>
      </footer>
    </div>
  )
}
