import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Fix Client Info
content = content.replace("""                          {user.name.charAt(0)}
                        <div>
                          <p className="text-sm font-bold text-foreground">{user.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-foreground/50 font-mono mt-0.5">
                            <span>{user.id}</span>
                            <span>•</span>
                            <span>{user.email}</span>
                    </td>""", """                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{user.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-foreground/50 font-mono mt-0.5">
                            <span>{user.id}</span>
                            <span>•</span>
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>""")

# Fix Status & Tier
content = content.replace("""                          <span className={`text-[10px] font-bold uppercase ${user.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {user.status}
                          </span>
                    </td>""", """                          <span className={`text-[10px] font-bold uppercase ${user.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </td>""")

# Fix KYC & Risk
content = content.replace("""                        <span className="text-xs font-medium text-foreground/70">Verified</span>
                    </td>""", """                        <span className="text-xs font-medium text-foreground/70">Verified</span>
                      </div>
                    </td>""")

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
