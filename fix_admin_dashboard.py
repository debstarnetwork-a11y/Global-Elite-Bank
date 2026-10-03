with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                  </button>
                </div>
              </div>
            </div>""",
"""                  </button>
                </div>
              </div>
              </>
            )}
            </div>""")

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
