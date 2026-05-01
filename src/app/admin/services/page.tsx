import dbConnect from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import Service from "@/lib/models/Service";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/admin/login');
  }

  await dbConnect();
  const services = await Service.find().sort({ order: 1 });

  return (
    <div className="bg-cream-100 min-h-screen p-8 text-charcoal-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display text-4xl text-brown-800">Services Management</h1>
          <Link 
            href="/admin" 
            className="text-sm font-body text-charcoal-600 hover:text-brown-800 underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-sm border border-cream-200 overflow-hidden shadow-sm">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-cream-50 border-b border-cream-200 text-charcoal-400 uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono">{service.order}</td>
                  <td className="px-6 py-4 font-semibold text-charcoal-900">{service.title}</td>
                  <td className="px-6 py-4 text-charcoal-500">{service.slug}</td>
                  <td className="px-6 py-4 uppercase text-[10px] tracking-wider">{service.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      service.publishStatus === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {service.publishStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link 
                        href={`/services/${service.slug}`} 
                        target="_blank"
                        className="text-blush-400 hover:text-blush-600 underline text-xs"
                      >
                        Preview
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="mt-8 text-xs text-charcoal-400 italic">
          * Note: Full CRUD UI is currently restricted to API endpoints (/api/admin/services) per initial scope.
        </p>
      </div>
    </div>
  );
}
